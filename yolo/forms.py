from django import forms
from .models import ImageModel


# creating a form
class GeeksForm(forms.ModelForm):
    # create meta class
    class Meta:
        # specify model to be used
        model = ImageModel

        # specify fields to be used
        fields = [
            "title",
            "image_file",
        ]
