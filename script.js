"use strict";


const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');


let ready = false;
let imageLoaded = 0;
let totalImages = 0;
let photosArray = [];


let imageCount = 5;
const apikey ='';
const contentFilter = 'high';
const query = 'nature';
let apiUrl =`https://api.unsplash.com/photos/random/?client_id=${apikey}&count=${imageCount}&content_filter=${contentFilter}&query=${query}`;



//Get photos from unsplash API

function imageLoadedFunction () {
    imageLoaded++;
    if(imageLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        initialLoadChecker();
    }
}


function initialLoadChecker() {
    if (imageCount === 5) {
        imageCount = 30;
        apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apikey}&count=${imageCount}&content_filter=${contentFilter}&query=${query}`;
    }
}

// Create Elements for links & photos, add to DOM
function displayPhotos(){

    imageLoaded =0;
    totalImages = photosArray.length;
    
    photosArray
        .forEach( photo => processPhoto(photo) );

}

function processPhoto(photo) {
    const item = constructATagFromPhotoElement(photo);
    const img = constructImgTagFromPhotoElement(photo);

    item.appendChild(img);
    imageContainer.appendChild(item);
}

function setAttributes(elment, attributes){

    for( const key  in attributes){
        elment.setAttribute(key,attributes[key]);
    }

}

function constructImgTagFromPhotoElement(photo) {
    const img = document.createElement('img');

    setAttributes(img,
        { 'src': photo.urls.regular,
          'alt': photo.alt_description,
          'title': photo.alt_description
        });

    img.addEventListener('load',imageLoadedFunction);    
    return img;
}

function constructATagFromPhotoElement(photo) {
    const item = document.createElement('a');

    setAttributes(item,{
        'href': photo.links.html,
        'target':'_blank'
    });

    return item;
}

async function getDataFromApi() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function getPhotos(){

    try{
        photosArray = await getDataFromApi();
        displayPhotos();

    }catch(error){
       loader.hidden = false;
    }
}


function scrollEvent() {
    return () => {
        const innerHeight = window.innerHeight;
        const scrollY = window.scrollY;
        const documentBodyHeight = document.body.offsetHeight;

        if (innerHeight + scrollY >= documentBodyHeight - 1000 && ready) {
            ready = false;
            getPhotos();
        }
    };
}


// Check to see if scroll near botton of page
window.addEventListener('scroll',scrollEvent());


// On Load
getPhotos();

