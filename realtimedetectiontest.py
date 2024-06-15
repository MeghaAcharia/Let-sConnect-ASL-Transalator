import cv2
import mediapipe as mp
import numpy as np
from keras.models import load_model



def recognize_sign():

    # Load the trained model
    model = load_model('sign_language_model.h5')
    gestures = ['a','again','age', 'b', 'c', 'd','department', 'e','engineering', 'f','family', 'father', 'forget', 'g', 'go', 'good', 'h','happy','have', 'hello', 'help', 'how are you','hurt', 'i','iam', 'j', 'k', 'l','learning','like','live', 'm', 'me','meet', 'more', 'mother', 'n','name','need','nice', 'no', 'o', 'p', 'please','practice', 'q', 'r', 's', 'sorry', 't', 'thankyou','time', 'u', 'v','vacation', 'w','want', 'what','where', 'x', 'y', 'yes','your', 'z']
    words = ['Dont_like', 'Hello', 'Like', 'Love', 'My', 'No', 'What', 'Yes', 'Your', 'Afternoon', 'Good', 'Help',
                'House', 'Make', 'More', 'Morning', 'Name', 'Pay']

    # Initialize MediaPipe Hands
    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    cap = cv2.VideoCapture(r"C:\Desktop\backend\letsconnect_backend\videos\recorded-video.webm")
    sentence = []

    with mp_hands.Hands(min_detection_confidence=0.7, min_tracking_confidence=0.7) as hands:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = hands.process(image)

            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    mp_drawing.draw_landmarks(
                        image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                    landmarks = []
                    for lm in hand_landmarks.landmark:
                        landmarks.append([lm.x, lm.y, lm.z])

                    landmarks = np.array(landmarks).flatten()
                    landmarks = landmarks.reshape((1, 21, 3))

                    prediction = model.predict(landmarks)
                    class_id = np.argmax(prediction)
                    gesture = gestures[class_id]
                    
                    cv2.putText(image, gesture, (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2, cv2.LINE_AA)
                    
                    # Append gesture to the sentence
                    sentence.append(gesture)

            # cv2.imshow('Sign Language Recognition', image)
            # if cv2.waitKey(1) & 0xFF == 13:  # Enter key to start/stop
            #     break

    # cap.release()
    # cv2.destroyAllWindows()
    final =[]
    print("FINAL TEMP:",sentence)

    filtered_list = []
    current_word = None
    current_count = 0

    for word in sentence:
        if word == current_word:
            current_count += 1
        else:
            current_word = word
            current_count = 1

        if current_count > 10:
            filtered_list.append(word)


    print("\n\ntemp:: ",filtered_list)

    for i in range(len(filtered_list)-1):
        if filtered_list[i] != filtered_list[i+1]:
            final.append(filtered_list[i])
            
    final.append(filtered_list[len(filtered_list)-1])
            
    print("\n\nekdum final",final)

    txt=" "

    for i in range(len(final)):
        if final[i] == 'Space':
            txt = txt + " "

        elif final[i] in words:
            txt = txt + " " + final[i] + " "
            
        else:
            txt = txt +" "+ final[i]
        
    print("\n\n",txt)

    return txt

    return ' '.join(sentence)


# Run the sign language recognition
translated_sentence = recognize_sign()
print(f'Translated Sentence: {translated_sentence}')
