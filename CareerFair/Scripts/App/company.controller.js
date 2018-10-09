angular.module("careersDayApp")
    .controller("companyController", ["$scope", "$state", "$interval", "userService", "cvService", "studentService",
        function ($scope, $state, $interval, userService, cvService, studentService) {
            if (!userService.userLoaded || !studentService.studentsLoaded) {
                $state.transitionTo("home");
            }

            if (!userService.isCompany()) {
                $state.transitionTo("home");
            }

            $scope.data = {
                user: userService.user,
                cvs: [],
                general_cvs: []
            };

            $scope.viewCompany = true;
            $scope.student2skill = {};

            $scope.toggleViewCompany = function () {
                $scope.viewCompany = !$scope.viewCompany;
            }

            var appWebUrl = userService.appWebUrl;
            var hostWebUrl = userService.hostWebUrl;

            cvService.loadCVs(hostWebUrl, $scope.data.user.company, function (cvs) {
                console.log("CompanyController: %d CVs Loaded", cvs.length);
                $scope.data.cvs = cvs;
                $scope.$apply();

                $('#cvTable').DataTable();
            });

            cvService.loadCVs(hostWebUrl, "GENERAL", function (cvs) {
                console.log("CompanyController: %d CVs Loaded (GENERAL)", cvs.length);
                $scope.data.general_cvs = cvs;

                studentService.loadStudents(function (students) {
                    for (var i = 0; i < students.length; i++) {
                        $scope.student2skill[students[i].email] = students[i].skills;
                    }

                    $scope.$apply();
                    
                    $('#allCvTable').DataTable();

                });
        
            });

        }]);