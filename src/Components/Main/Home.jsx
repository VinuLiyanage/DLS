import React from 'react';
import MonthlySales from '../Charts/MonthlySales';
import DistrictSales from '../Charts/DistrictSales';
function Home(){
    return(
    <React.Fragment>
        {/* <div className='card'>
            <MonthlySales/>
        </div> */}
        <div className='card'>
            <DistrictSales/>
        </div>    
    </React.Fragment>
    );
}

export default Home;