from django.db import models


# declare a new model with a name "GeeksModel"
class ImageModel(models.Model):
    # fields of the model
    title = models.CharField(max_length=200)
    image_file = models.FileField

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.title

    def is_valid(self):
        pass

