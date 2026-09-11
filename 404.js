
        document.addEventListener("DOMContentLoaded", function () {

            "use strict";


            const backButton =
                document.getElementById("stackly404BackButton");


            if (!backButton) {
                return;
            }


            backButton.addEventListener("click", function () {

                /*
                 * If the visitor has a previous page,
                 * return to that page.
                 */

                if (window.history.length > 1) {

                    window.history.back();

                }

                /*
                 * If there is no previous page,
                 * send the visitor to the homepage.
                 */

                else {

                    window.location.href = "index.html";

                }

            });

        });

    