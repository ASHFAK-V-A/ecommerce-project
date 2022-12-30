
  function changequantity(cartId, productId, count){
 
    console.log(productId);
    let quantity = parseInt(document.getElementById(productId).innerHTML) 
    console.log(quantity);
    $.ajax({
        url:"/change-quantity", 
         method:'post',
        data:{
            cartId,
             productId,
              count,
              quantity
         }, 
       
        success: (response)=>{ 
          if(response.status){
            document.getElementById(productId).innerHTML = quantity + count;
            document.getElementById("netamount").innerHTML ="₹"+ response.productData[0].total
           
          }  
          if(response.quantity){
            swal({
              title: "Product removed from Cart!",
              icon: "success",
              confirmButtonText: "OK", 
              
            }).then(function () { 
    
              location.reload();
            });
         
          }    
           
        } 
    })
  }

function addtowishlist(wishlist){
  console.log('working');
$.ajax({
  url:'/wishlisht/'+wishlist,
  method:'get',
  success:()=>{
    swal({
         title: "Product added to Wishlist",
         icon: "success",
         confirmButtonText: "OK",
 }).then(()=>{
 location.reload()
 })
}
})


}







  function removewishlist(wishlistId,productId){
    console.log('working');
    console.log(wishlistId);
    console.log(productId);
    $.ajax({
      url:"/wishlist-remove",
         method:'post',
      data: {
       wishlistId, 
      productId
      },
    
      success:()=>{
        swal({
          title: "Product removed from Wishlist!",
          icon: "success",
          confirmButtonText: "OK", 
          
        }).then(function () { 

          location.reload();
        });
      }
    })
  }