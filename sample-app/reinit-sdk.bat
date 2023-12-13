CALL npm uninstall pine-react
CALL npm link "../React SDK"
CALL cd "../React SDK"
CALL npm i
CALL npm run build
CALL npm install "../React SDK"
