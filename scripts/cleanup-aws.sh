#!/usr/bin/env bash
# One-shot cleanup of any orphaned shopsmart-* resources from a failed Terraform apply.
# Safe to re-run — every step tolerates "not found".
#
# Usage:
#   export AWS_ACCESS_KEY_ID=... AWS_SECRET_ACCESS_KEY=... AWS_SESSION_TOKEN=... AWS_REGION=us-east-1
#   bash scripts/cleanup-aws.sh

set -uo pipefail
PROJECT="${PROJECT_NAME:-shopsmart}"

echo "==> Region: ${AWS_REGION:-unset}"

# ---------- ECS service + cluster ----------
echo "==> ECS service / cluster"
aws ecs update-service --cluster "${PROJECT}-cluster" --service "${PROJECT}-service" --desired-count 0 >/dev/null 2>&1 || true
aws ecs delete-service --cluster "${PROJECT}-cluster" --service "${PROJECT}-service" --force >/dev/null 2>&1 || true
aws ecs delete-cluster --cluster "${PROJECT}-cluster" >/dev/null 2>&1 || true

# ---------- ALB listeners + ALB + target group ----------
echo "==> ALB"
ALB_ARN=$(aws elbv2 describe-load-balancers --names "${PROJECT}-alb" --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null || true)
if [ -n "$ALB_ARN" ] && [ "$ALB_ARN" != "None" ]; then
  for L in $(aws elbv2 describe-listeners --load-balancer-arn "$ALB_ARN" --query 'Listeners[*].ListenerArn' --output text); do
    aws elbv2 delete-listener --listener-arn "$L" >/dev/null 2>&1 || true
  done
  aws elbv2 delete-load-balancer --load-balancer-arn "$ALB_ARN" >/dev/null 2>&1 || true
  echo "    waiting for ALB to drain..."
  sleep 30
fi

echo "==> Target group"
TG_ARN=$(aws elbv2 describe-target-groups --names "${PROJECT}-tg" --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null || true)
if [ -n "$TG_ARN" ] && [ "$TG_ARN" != "None" ]; then
  aws elbv2 delete-target-group --target-group-arn "$TG_ARN" >/dev/null 2>&1 || true
fi

# ---------- Security groups ----------
echo "==> Security groups"
for SG in "${PROJECT}-service-sg" "${PROJECT}-alb-sg"; do
  SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=$SG" --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || true)
  if [ -n "$SG_ID" ] && [ "$SG_ID" != "None" ]; then
    aws ec2 delete-security-group --group-id "$SG_ID" >/dev/null 2>&1 || true
  fi
done

# ---------- ECR repo ----------
echo "==> ECR repo"
aws ecr delete-repository --repository-name "${PROJECT}-server" --force >/dev/null 2>&1 || true

# ---------- CloudWatch logs ----------
echo "==> CloudWatch logs"
aws logs delete-log-group --log-group-name "/ecs/${PROJECT}" >/dev/null 2>&1 || true

# ---------- S3 assets bucket(s) ----------
echo "==> S3 assets bucket"
for B in $(aws s3api list-buckets --query "Buckets[?starts_with(Name, '${PROJECT}-assets-')].Name" --output text); do
  echo "    deleting $B"
  aws s3 rm "s3://$B" --recursive >/dev/null 2>&1 || true
  aws s3api delete-bucket --bucket "$B" >/dev/null 2>&1 || true
done

# ---------- Orphaned task definitions ----------
echo "==> Deregistering task definitions in family ${PROJECT}-task"
for TD in $(aws ecs list-task-definitions --family-prefix "${PROJECT}-task" --query 'taskDefinitionArns[*]' --output text); do
  aws ecs deregister-task-definition --task-definition "$TD" >/dev/null 2>&1 || true
done

echo
echo "Cleanup complete. Re-trigger the pipeline."
