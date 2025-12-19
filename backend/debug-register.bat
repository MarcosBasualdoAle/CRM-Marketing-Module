@echo off
echo CHECKING MAVEN VERSION...
call mvnw.cmd -version
echo.
echo RUNNING APP VERBOSELY...
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=console -Dspring-boot.run.jvmArguments="-Dspring.main.web-application-type=none"
pause
