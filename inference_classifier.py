import pickle

import cv2
import mediapipe as mp
import numpy as np

def sign_lang_recognition_asl():

    MODEL_PATH = 'model.p'
    MODEL_PATH_t = 'model_t.p'
    
    model_dict = pickle.load(open(MODEL_PATH, 'rb'))
    model = model_dict['model']

    model_dict_t = pickle.load(open(MODEL_PATH_t, 'rb'))
    model_t = model_dict_t['model_t']

    cap = cv2.VideoCapture(r"C:\Desktop\backend\letsconnect_backend\videos\recorded-video.webm")
    #cap = cv2.VideoCapture(0)

    temp_list =[]

    mp_hands = mp.solutions.hands
    mp_drawing = mp.solutions.drawing_utils
    mp_drawing_styles = mp.solutions.drawing_styles

    hands = mp_hands.Hands(static_image_mode=True,max_num_hands=2, min_detection_confidence=0.3)

    labels_dict = {0: 'A', 1: 'B',2:'C',3:'D',4:'E',5:'F',6:'G',7:'H',8:'I',9:'J',10:'K',11:'L',12:'M',13:'N',14:'O',15:'P',16:'Q',17:'R',18:'S',19:'T',20:'U',21:'V',22:'W',23:'X',24:'Y',25:'Z',26:'1',27:'3',28:'4',29:'5',30:'hello',31:'good'}
    labels_dict_t = {0: 'what', 1: 'me',2:'you',3:'my_mine',4:'house',5:'yes',6:'no',7:'like',8:'thank_you',9:'where'}
    words = ['Dont_like', 'Hello', 'Like', 'Love', 'My', 'No', 'What', 'Yes', 'Your', 'Afternoon', 'Good', 'Help',
              'House', 'Make', 'More', 'Morning', 'Name', 'Pay']
    
    while True:

        data_aux = []
        x_ = []
        y_ = []

        ret, frame = cap.read()

        if not ret:
            break

        H, W, _ = frame.shape

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        results = hands.process(frame_rgb)
        if results.multi_hand_landmarks:
            n = len(results.multi_hand_landmarks)
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    frame,  # image to draw
                    hand_landmarks,  # model output
                    mp_hands.HAND_CONNECTIONS,  # hand connections
                    mp_drawing_styles.get_default_hand_landmarks_style(),
                    mp_drawing_styles.get_default_hand_connections_style())

            for hand_landmarks in results.multi_hand_landmarks:
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y

                    x_.append(x)
                    y_.append(y)

                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    data_aux.append(x - min(x_))
                    data_aux.append(y - min(y_))

            if n==1:

            # Pad or truncate data_aux to ensure uniform length
                max_length = 84  # 21 landmarks * 2 coordinates (x, y) * 2 hands
                data_aux = data_aux[:max_length] + [0] * (max_length - len(data_aux))
                
                x1 = int(min(x_) * W) - 10
                y1 = int(min(y_) * H) - 10

                x2 = int(max(x_) * W) - 10
                y2 = int(max(y_) * H) - 10

                prediction1 = model.predict([np.asarray(data_aux)])

                predicted_character1 = labels_dict[int(prediction1[0])]
                # print(predicted_character1)
                temp_list.append(predicted_character1)

                # cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 4)
                # cv2.putText(frame, predicted_character1, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 0), 3,
                        #    cv2.LINE_AA)
            else:
                # Pad or truncate data_aux to ensure uniform length
                max_length = 84  # 21 landmarks * 2 coordinates (x, y) * 2 hands
                data_aux = data_aux[:max_length] + [0] * (max_length - len(data_aux))
                x1 = int(min(x_) * W) - 10
                y1 = int(min(y_) * H) - 10

                x2 = int(max(x_) * W) - 10
                y2 = int(max(y_) * H) - 10

                prediction2 = model_t.predict([np.asarray(data_aux)])

                predicted_character2 = labels_dict_t[int(prediction2[0])]
                # print(predicted_character2)
                temp_list.append(predicted_character2)
                # cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 0), 4)
                # cv2.putText(frame, predicted_character2, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 0, 0), 3,
                #           cv2.LINE_AA)

        # cv2.imshow('frame', frame)
        # cv2.waitKey(1)

    final =[]
    print("FINAL TEMP:",temp_list)

    filtered_list = []
    current_word = None
    current_count = 0

    for word in temp_list:
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

print(sign_lang_recognition_asl())