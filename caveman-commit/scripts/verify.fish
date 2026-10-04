find . -maxdepth 3 -name .git -type d; echo "---"; ls -la .
echo "---log---" && git log --oneline -5 
echo "---status caveman-commit---"
git status --short -- .
echo "---tracked?---"
git ls-files . | head

