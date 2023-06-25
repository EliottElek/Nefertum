import glob
import os
import os.path

from termcolor import colored
path = os.path.join("./app", "matrixes")

filelist = glob.glob(os.path.join(path, "*.csv"))
if (len(filelist) == 0):
    print(colored("No .csv file to delete.", "green"))

else:
    print(colored("Deleting " + str(len(filelist))+" matrixes...", "green"))
    for f in filelist:
        os.remove(f)
    print(colored("Done ✅", "green"))

############## CLEARING ANSWERS ###################
