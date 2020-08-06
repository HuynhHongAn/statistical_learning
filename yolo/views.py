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
                "description": "Good at YOLO basic detection"
            },
            {
                "name": "Advancezz",
                "image": "../static/img/3.png",
                "description": "Good at traffic signs detection"
            },
        ]
    })


def detect(request):
    global network, colours, layers_names_output, labels
    if request.method == 'GET':
        network, colours, layers_names_output, labels = helpers.load_yolo_coco_modal()
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
            print(request.POST)
            my_file = request.FILES['image']
            fs = FileSystemStorage()
            filename = fs.save(my_file.name, my_file)
            image_path = fs.path(filename)

            extra_info = helpers.detect_image(image_path,
                                              float(request.POST['probability_minimum']),
                                              float(request.POST['threshold']),
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
