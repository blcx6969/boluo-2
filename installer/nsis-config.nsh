; AI Agent Hub NSIS Configuration
!macro customInstall
  CreateDirectory "$SMPROGRAMS\AI Agent Hub"
  CreateShortCut "$SMPROGRAMS\AI Agent Hub\AI Agent Hub.lnk" "$INSTDIR\AI Agent Hub.exe" "" "$INSTDIR\resources\icons\icon-512.png"
!macroend
!macro customUnInstall
  Delete "$SMPROGRAMS\AI Agent Hub\AI Agent Hub.lnk"
  RMDir "$SMPROGRAMS\AI Agent Hub"
!macroend
