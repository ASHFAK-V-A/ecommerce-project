
$("#placeOrder").submit((e)=>{
    console.log('ajax working');
    e.preventDefault();
    $.ajax({
        url: '/placeOrder',
        method: 'post',
        data: $('#placeOrder').serialize(),
        success: (response) => {
            
            if(response.invalid){
                swal({
                    title:"Coupon no longer exist!",
                    icon:"error",
                    confirmButtonText: "continue",
                }).then(function (){
                    location.reload()
                })
    
    
            console.log('invalid coupon');
        
         }else if(response.couponDeleted){
            swal({
                title:"Coupon no longer exist!",
                icon:"error",
                confirmButtonText: "continue",
            }).then(function (){
                location.reload()
            })

            }else if(response.coupon){
                swal({
                    title:"Coupon already used!",
                    icon:"error",
                    confirmButtonText: "continue",
                }).then(function (){
                    location.reload()
                })
            }else if(response.success){
                console.log('sucess');
                location.href = "/ordersuccess"
            }else if(response.url){

                window.location=response.url
        
            }
            
        }
})
})

