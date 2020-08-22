"use strict";
import {key} from './modules/config.js';
import {updateElementWithAtt, dataFromApi} from './modules/utils.js'


const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');


let ready = false;
let imageLoaded = 0;
let totalImages = 0;
let photosArray = [];


let imageCount = 5;
const contentFilter = 'high';
const query = 'nature';
const apikey = key;
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
        imageCount = 5;
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

    const divInner = constructDivInner(photo);
    const divFront = constructFront();
    const divBack = constructBack();
    const h1Desc = constructH1Description(photo);
    const h1Author = constructH1Author(photo);
    const item = constructATagFromPhotoElement(photo);
    const img = constructImgTagFromPhotoElement(photo);

    item.appendChild(img);
    divFront.appendChild(item);
    divInner.appendChild(divFront);
    
    divBack.appendChild(h1Author);
    if(h1Desc!==null) divBack.appendChild(h1Desc);
    divInner.appendChild(divBack);
    imageContainer.appendChild(divInner);
}

function constructH1Author(photo){
    const h1 = document.createElement('h1');
    h1.innerText = "Author: "+photo.user.name;
    updateElementWithAtt(h1,{'class':'h1-author'});
    return h1;
}

function constructH1Description(photo){
    if(photo.alt_description!=null){
        const h1 = document.createElement('h1');
        h1.innerText = "Description: "+photo.alt_description;
        updateElementWithAtt(h1,{'class':'h1-desc'});
        return h1;
    }
    return null;
}

function constructBack(){
    const div = document.createElement('div');
    updateElementWithAtt(div,{'class':'item-back'});
    return div;
}

function constructFront(){
    const div = document.createElement('div');
    updateElementWithAtt(div,{'class':'item-front'});
    return div;
}

function constructDivInner(photo){
    const div = document.createElement('div');
    updateElementWithAtt(div,
                            {'class':'item-inner',
                             'width':photo.width/7,
                             'height':photo.height/7
                            });
    return div;
}


function constructImgTagFromPhotoElement(photo) {
    const img = document.createElement('img');

    updateElementWithAtt(img,
        { 'src': photo.urls.regular,
          'alt': photo.alt_description,
          'title': photo.alt_description,
          'width':photo.width/7,
          'height':photo.height/7
        });

    img.addEventListener('load',imageLoadedFunction);    
    return img;
}

function constructATagFromPhotoElement(photo) {
    const item = document.createElement('a');

    updateElementWithAtt(item,{
        'href': photo.links.html,
        'target':'_blank'
    });

    return item;
}



async function getPhotos(imageCount, contentFilter, query){
    try{
        photosArray = await dataFromApi(imageCount,contentFilter, query);
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
            getPhotos(imageCount,  contentFilter, query);
        }
    };
}


// Check to see if scroll near botton of page
window.addEventListener('scroll',scrollEvent());


// On Load
getPhotos(imageCount, contentFilter, query);

