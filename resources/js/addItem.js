document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addItemForm');
    const fileInput = document.getElementById('file');
    const fileChosen = document.getElementById('file-chosen');

    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileChosen.textContent = this.files[0].name;
        } else {
            fileChosen.textContent = 'No file chosen';
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted');
        // You can add your API call here
    });
    getNewSparePartId();

    document.getElementById('addItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addItem();
    });
});

function getNewSparePartId() {
    // TODO: Remove the testing code below
    // Testing purpose only
    document.getElementById('NewSparePart-id').textContent = "FK000SE1";
    // Simulating an API call to get a new spare part ID
    fetch('/api/getNewSparePartId')
        .then(response => response.json())
        .then(data => {
            document.getElementById('NewSparePart-id').textContent = data.id;
        })
        .catch(error => console.error('Error:', error));
}

function addItem() {
    const formData = new FormData();
    formData.append('id', document.getElementById('NewSparePart-id').textContent);
    formData.append('category', document.getElementById('category').value);
    formData.append('name', document.getElementById('input-part-no').value);
    formData.append('weight', document.getElementById('input-weight').value);
    formData.append('quantity', document.getElementById('input-stock-quantity').value);
    formData.append('price', document.getElementById('input-price').value);
    formData.append('description', document.getElementById('description').value);

    const fileInput = document.getElementById('file');
    if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
    }

    fetch('/api/addItem', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Item added successfully');
                // Redirect or clear form
                location.href = 'Item.html';
            } else {
                alert('Failed to add item: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the item');
        });
}