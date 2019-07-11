#import os
#os.chdir("C:\\xampp\\htdocs\\type-game")
import random 

def get_words(file):
    f = open(file, 'r')
    words = []
    word = ''
    for i in f.read():
        
        word = word + i
        if i == ' ' or i =='.':
            words.append(word)
            word = ''
    r = random.randint(0, len(words))
    
    return words[r]
  
            

print(get_words('updates.txt'))