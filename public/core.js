var app = angular.module("todoApp", []);

app.controller("mainController", function($scope, $http) {
    $scope.formData = {};
    $scope.updateData = [];
    $scope.editMode = [];

    // when landing on the page, get all todos and show them
    $http.get("/api/todos").then(
        function(response) {
            $scope.todos = response.data;
            $scope.todos.forEach(item => {
                $scope.updateData.push({ text: "" });
                $scope.editMode.push(false);
            });
            console.log(response.data);
        },
        function(data) {
            console.log("Error: " + data);
        }
    );

    $scope.setUpdateText = function(text, index) {
        console.log(index);
        $scope.updateData[index].text = text;
        console.log($scope.updateData);

        $scope.editMode[index] = true;
    };

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post("/api/todos", $scope.formData).then(
            function(response) {
                $scope.formData = {};
                $scope.todos = response.data;
                $scope.updateData.push({ text: "" });
                $scope.editMode.push(false);
                console.log(response.data);
            },
            function(data) {
                console.log("Error: " + data);
            }
        );
    };

    $scope.updateTodo = function(id, index) {
        $http.post("/api/todos/" + id, $scope.updateData[index]).then(
            function(response) {
                $scope.updateData[index] = {};
                $scope.editMode[index] = false;
                $scope.todos = response.data;
                console.log(response.data);
            },
            function(data) {
                console.log("Error: " + data);
            }
        );
    };

    //delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete("/api/todos/" + id).then(
            function(response) {
                $scope.todos = response.data;
                console.log(response.data);
            },
            function(data) {
                console.log("Error: " + data);
            }
        );
    };
});
