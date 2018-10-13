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

                $scope.$apply(function () {

                    $scope.data.general_cvs = cvs;

                    dataSet = [];

                    for (var i = 0; i < cvs.length; i++) {
                        dataSet.push([cvs[i].student.name, cvs[i].student.skills, { file: cvs[i].file, link: cvs[i].link }]);
                    }

                    $("#allCvTable").DataTable({
                        data: dataSet,
                        columns: [
                            { title: "Student Name" },
                            { title: "Skills" },
                            {
                                title: "CV",
                                render: function (data, type, row, meta) {
                                    if (type === 'display') {
                                        data = '<a href="' + data.link + '" target="_blank">' + 'Download (' + data.file + ')</a>';
                                    }

                                    return data;
                                }
                            }
                        ]
                    });

                });

                });

        }]);