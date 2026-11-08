Add-Type -AssemblyName System.Speech
$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice.Rate = 1
$voice.Volume = 85
$audioPath = Join-Path $PSScriptRoot '../public/media/ouch.wav'
try {
  $voice.SetOutputToWaveFile([System.IO.Path]::GetFullPath($audioPath))
  $voice.Speak('Ouch!')
} finally {
  $voice.Dispose()
}
