
export function updateElementWithAtt(elment, attributes){

    for( const key  in attributes){
        elment.setAttribute(key,attributes[key]);
    }

}

export async function dataFromApi(imageCount, contentFilter, query) {
     const response = await fetch(`/.netlify/functions/keyHide?count=${imageCount}&contentFiler=${contentFilter}&&query=${query}`);
     const data = await response.json();
     return data;
}

 
