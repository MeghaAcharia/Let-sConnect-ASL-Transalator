import speech_recognition as sr
def speech_to_text():
    r = sr.Recognizer()
    print("Please Talk")
    with sr.Microphone() as source:
        # Records audio for 5 seconds and stores in a variable called audio
        audio_data = r.record(source, duration=3)
        print("Recognizing audio...")
        text = r.recognize_google(audio_data)
        text = text.lower()
        print(text)
    
    return(text)