@echo off
title MelaScope NCR - Edit Local Secret Keys
echo ==============================================================================
echo Opening MelaScope NCR .env.local in Notepad...
echo Paste your GOOGLE_MAPS_API_KEY and press Ctrl+S to save.
echo ==============================================================================
notepad.exe "%~dp0.env.local"
