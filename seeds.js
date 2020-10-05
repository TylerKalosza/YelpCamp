const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data = [
    {
        name: "Algonquin Provincial Park",
        image: "https://www.hinzie.com/media/image/60103_max.jpg",
        description: "Algonquin, the first provincial park in Ontario, protects a variety of natural, cultural, and recreational features and values. As one of the largest provincial parks, Algonquin is diverse and offers something for nearly everyone."
    },
    {
        name: "Killbear Provincial Park",
        image: "https://i0.wp.com/rvplacestogo.com/wp-content/uploads/2017/07/feature-1.jpg",
        description: "Killbear Provincial Park is a provincial park located on Georgian Bay in the Parry Sound District of Ontario, near the town of Nobel. Killbear combines sandy beaches typical of the Great Lakes with the rock ridges and pines of the Canadian Shield."
    },
    {
        name: "Letchworth State Park",
        image: "https://www.travelingmom.com/wp-content/uploads/2015/10/DSC04764_edited-1-800x450.jpg",
        description: "Letchworth State Park is a 14,427-acre (5,838 ha) New York State Park located in Livingston County and Wyoming County in the northwestern part of the State of New York.[1][5] The park is roughly 17 miles (27 km) long, following the course of the Genesee River as it flows north through a deep gorge and over several large waterfalls.[6] It is located 35 miles (56 km) southwest of Rochester and 60 miles (97 km) southeast of Buffalo, and spans portions of the Livingston County towns of Leicester, Mount Morris, and Portage, as well as the Wyoming County towns of Castile and Genesee Falls."
    }
];

//----------------------
// Old seedDb function.
//----------------------

function seedDb() {
    // Remove all comments.
    Comment.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }

        console.log("Removed all comments.");

        // Remove all campgrounds.
        Campground.deleteMany({}, (err) => {
            if (err) {
                console.log(err);
            }

            console.log("Removed all campgrounds.");

            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added campground " + campground.name + ".");

                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet.",
                                author: "Homer Simpson"
                            }, (err, comment) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment - \"" + comment.text + "\".");
                                }
                            }
                        );
                    }
                });
            });
        });
    });
}

module.exports = seedDb;