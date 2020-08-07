import os

from django.shortcuts import (render)
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from . import helpers

network = None
colours = None
layers_names_output = None
labels = None


def index(request):
    return render(request, 'index.html')


def home(request):
    return render(request, 'home.html', {
        'robots': [
            {
                "name": "Basizz",
                "image": "../static/img/1.png",
                "description": "Good at BASIC detection",
                "url": "/yolo/detect",
            },
            {
                "name": "Advancezz",
                "image": "../static/img/3.png",
                "description": "Good at TRAFFIC SIGN detection",
                "url": "/yolo/detect?model=advanced",

            },
        ]
    })


def detect(request):
    global network, colours, layers_names_output, labels
    if request.method == 'GET':
        model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'yolo-coco-data/')
        model = request.GET.get('model', 'basic')
        if model == 'advanced':
            model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'yolo-ts-data/')

        network, colours, layers_names_output, labels = helpers.load_yolo_coco_modal(model_path)
        return render(request, 'detect.html', {
            'uploaded_file_url': "../static/img/CP4.png"
        })
    if request.method == 'POST':
        if len(request.FILES) == 0:
            return JsonResponse({
                'error_message': "Image is required",
                'uploaded_file_url': "../static/img/CP4.png"
            })
        elif request.POST['probability_minimum'] == "":
            return JsonResponse({
                'error_message': "Probability Minimum is required",
                'uploaded_file_url': "../static/img/CP4.png"
            })
        elif request.POST['threshold'] == "":
            return JsonResponse({
                'error_message': "Threshold is required",
                'uploaded_file_url': "../static/img/CP4.png"
            })
        else:
            probability_minimum = request.POST.get('probability_minimum', 0.5)
            threshold = request.POST.get('threshold', 0.3)
            my_file = request.FILES['image']
            fs = FileSystemStorage()
            filename = fs.save(my_file.name, my_file)
            image_path = fs.path(filename)

            extra_info = helpers.detect_image(image_path,
                                              float(probability_minimum),
                                              float(threshold),
                                              network,
                                              colours,
                                              layers_names_output,
                                              labels)

            fs.delete(filename)

            return JsonResponse({
                'extra_info': extra_info,
                'uploaded_file_url': "/media/detected-image.jpg"
            })
    else:
        return render(request, 'detect.html', {
            'uploaded_file_url': "../static/img/CP4.png"
        })
