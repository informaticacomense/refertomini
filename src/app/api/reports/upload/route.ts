grep -rl "@/src/lib/prisma" src | xargs sed -i 's#@/src/lib/prisma#@/lib/prisma#g'
