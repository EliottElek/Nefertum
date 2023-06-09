import glob
import os
import os.path

from termcolor import colored
path = os.path.join("./", "models")

filelist = glob.glob(os.path.join(path, "*.json"))
if (len(filelist) == 0):
    print(colored("No .json file to delete.", "green"))

else:
    print(colored("Deleting " + str(len(filelist))+" models...", "green"))
    for f in filelist:
        os.remove(f)
    print(colored("Done ✅", "green"))
