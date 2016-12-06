SET ASPNETCORE_ENVIRONMENT=Development
start /b cmd /c "C:\Users\Johnny\Documents\Inuplan\intranet\Inuplan.WebAPI\bin\Debug\Inuplan.WebAPI.exe"
start /b cmd /c "C:\Program Files (x86)\IIS Express\iisexpress.exe" /config:C:\Users\Johnny\Documents\Inuplan\intranet\.vs\config\applicationhost.config /site:Inuplan.Intranet
