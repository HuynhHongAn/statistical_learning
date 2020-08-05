function readURL(input) {
    if (input.files && input.files[0]) {
        $(".alert").remove()

        var reader = new FileReader();

        reader.onload = function (e) {
            $('#image-preview')
                .attr('src', e.target.result)
        };

        reader.readAsDataURL(input.files[0]);
    } else {

    }
}

function getAlertMessage(type, message) {
    switch (type) {
        case "success":
            return `
				<div class="alert alert-success alert-dismissible" role="alert" style="text-align: left">
					<span type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></span>
					<strong>Successfully</strong> ${message}
				</div>
			`
        case "error":
            return `
				 <div class="alert alert-danger alert-dismissible" role="alert" style="text-align: left">
					<span type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></span>
					<strong>Error</strong> ${message}
				</div>
			`
    }
}

$(document).ready(function () {
    $("#detect-form").submit(function (e) {
        e.preventDefault();

        const form = $(this);
        const url = form.attr('action');

        let fd = new FormData(document.getElementById("detect-form"));
        let files = $('#image-input')[0].files[0];
        fd.append('file', files);

        $.ajax({
            type: "POST",
            url: url,
            data: fd,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.error_message) {
                    form.prepend(getAlertMessage("error", data.error_message))
                } else {
                    $(".alert").hide('bind', {}, 500)
                    form.prepend(getAlertMessage("success", "detect image"))

                    $('#image-preview').attr('src', data.uploaded_file_url)
                }
            },
            error: function (e) {
                console.log(e)
                form.prepend(getAlertMessage("error", e.message))
            }
        });
    });
});