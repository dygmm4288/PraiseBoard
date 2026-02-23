set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT/shared/types"

npx supabase gen types typescript \
  --project-id tsalodguhiuzpwslfqws \
  --schema public > supabase.types.ts

echo "✅ Generated at $PROJECT_ROOT/supabase.types.ts"