from gensim.models import KeyedVectors
import random
import os
import numpy
from prompt_toolkit import prompt

path = os.path.join("./", "data")
emb_path = os.path.join(path, 'smells.kv')
emb = KeyedVectors.load(emb_path)


def get_rand_question():
    # Random vector selection
    rand = emb.vectors[random.randint(0, len(emb.vectors)-1)]
    attribute = emb.most_similar(rand, topn=1)
    return attribute[0][0]


def get_next_question(current, radius):
    random_point = numpy.random.randn(100)
    # Normalize the random vector and scale it by a random radius
    random_dist = random.randint(0, radius)
    random_point = current + random_dist * \
        random_point / numpy.linalg.norm(random_point)

    return emb.most_similar(random_point, topn=1)[0][0]


def get_next_position(answer, distance, current_pos, attr_pos):
    next_pos = numpy.zeros(100)
    # takes current_pos, depending on answer, move closer or further from attr_pos
    match answer:
        case "yes":
            next_pos = translate_towards(attr_pos, current_pos, distance)
            # Move cursor closer to attr_pos
        case "no":
            # Move cursor further from attr_pos
            next_pos = translate_towards(attr_pos, current_pos, -distance)

    return next_pos


def main():
    answer = ""
    radius = 2
    distance = 0.8

    current_pos = numpy.zeros(100)
    # Intitialisation
    while answer != "yes":

        attr = get_rand_question()
        current_pos = emb.get_vector(attr)
        question = str("Can your smell be considered as " +
                       #    str(emb.get_vecattr(curr_attribute, attr="value")))
                       str(attr))

        answer = prompt(question)

    while radius > 0.1:
        print(radius)
        attr = get_next_question(current_pos, radius)
        question = str("Can your smell be considered as " +
                       #    str(emb.get_vecattr(curr_attribute, attr="value")))
                       str(attr))
        answer = prompt(question)
        current_pos = get_next_position(
            answer, distance, current_pos, emb.get_vector(attr))
        radius -= 0.2
        distance -= 0.1

    print(current_pos)
    return


# distance for yes, -distance for no
def translate_towards(target, initial, distance):
    direction = target - initial
    direction /= numpy.linalg.norm(direction)
    translation = distance * direction
    return initial + translation


if __name__ == '__main__':
    main()
