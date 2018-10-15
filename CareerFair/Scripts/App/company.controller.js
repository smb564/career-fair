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
                dataSet = [];

                $scope.data.general_cvs = cvs;
                $scope.$apply();

                for (var i = 0; i < cvs.length; i++) {
                    if (cvs[i].student == undefined) {
                        continue;
                    }

                    dataSet.push([cvs[i].student.name, cvs[i].student.skills, cvs[i].student.achievements, { file: cvs[i].file, link: cvs[i].link }]);
                }

                var table = $("#allCvTable").DataTable({
                    data: dataSet,
                    columns: [
                        { title: "Student Name" },
                        { title: "Skills" },
                        { title: "Achievements" },
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

                $('#allCvTable tfoot th').each(function () {
                    var title = $(this).text();
                    if (title != "") {
                        // no need of an option to search for CV
                        $(this).html('<input style="width: 100%; box-sizing: border-box; padding: 3px;" type="text" placeholder="Search ' + title + '" />');
                    }
                });

                table.columns().every(function () {
                    var that = this;
                    $('input', this.footer()).on('keyup change', function () {
                        if (that.search() !== this.value) {
                            that
                              .search(this.value)
                              .draw();
                        }
                    });
                });

            });
        }]);