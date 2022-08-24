import React, { useState,useEffect } from 'react';
import axios from "axios";

import { useParams} from 'react-router-dom';
import Image from 'react-bootstrap/Image'

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';


function RecipeDetails() {
    const [recipeDetails, setRecipeDetails] = useState([]);

    const params = useParams();
    const recipeId =params.recipeId;
    useEffect(() => {
        fetchRecipe();
    },[]);
    
    const fetchRecipe = async()=>{
        const appId = '7cbf5469';
        const appKey = 'ab9b4b8ea8cd2ce4fc30bf1a3ce7f657';
       
        await axios.get(`https://api.edamam.com/api/recipes/v2/${recipeId}?type=public&app_id=${appId}&app_key=${appKey}`)
        .then((response) => {
          console.log(response.data)
          console.log(response.data.recipe)
          setRecipeDetails(response.data.recipe)
        }).catch(error => {
            console.log('error to fetch recipe list')
            console.log(error)
        });
    }
    return (
        <Container>
            {recipeDetails.ingredients!=undefined?
            <Card body className='m-4'>
                <Row>
                    <Col xs={12} md={6}>
                        <Image fluid src={recipeDetails.image} width="100%"  height="100%"></Image>
                    </Col>
                    <Col xs={12} md={6}>
                            <h4>{recipeDetails.label}</h4>
                            <h6>See full recipe on: <a style={{"textDecoration":"underline"}} href={recipeDetails.uri}>{recipeDetails.source}</a></h6>
                        
                        <Row sm={12} md={12} className="mb-2">
                            <ul>
                                <li className='mx-1'><a href="mailto:?subject=<SUBJECT>&body=<BODY>"><i style={{'color':"black",'fontSize':'22px'}} class="fa-solid fa-envelope"></i><br></br>EMAIL</a></li>
                                <li className='mx-1'><a href="http://pinterest.com/pin/create/link/?url="><i style={{'color':"red",'fontSize':'22px'}} class="fa-brands fa-pinterest"></i><br></br>PIN IT</a></li>
                                <li className='mx-1'><a href="https://www.facebook.com/sharer/sharer.php?u=<URL>"><i style={{'color':"blue",'fontSize':'22px'}} class="fa-brands fa-square-facebook"></i><br></br>SHARE</a></li>
                                <li className='mx-1'><a  href="https://twitter.com/share?url=<URL>&text=<TEXT>via=<USERNAME>"><i style={{'color':"skyblue",'fontSize':'22px'}} class="fa-brands fa-square-twitter"></i><br></br>TWEET</a></li>
                                <li className='mx-1'><a href="https://plus.google.com/share?url=YOUR_URL"><i style={{'color':"red",'fontSize':'22px'}} class="fa-brands fa-square-google-plus"></i><br></br>GOOGLE+</a></li>
                            </ul>
                        </Row>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col xs={12} md={6} style={{"textAlign":"left"}}>
                        <Row className="mb-1"><h3 style={{"font":"normal 20px Georgia","font-size":"1.6em"}}>{recipeDetails.ingredients.length} Ingredients</h3></Row>
                        <hr></hr>
                        {recipeDetails.ingredients.map((ingr)=>(
                            <p>{ingr.text}</p>
                        ))}
                    </Col>
                    <Col xs={12} md={6}>
                        <Row className="mb-1" style={{"textAlign":"left"}}><h3 style={{"font":"normal 20px Georgia","font-size":"1.6em"}}>Nutrition</h3></Row>
                        <hr></hr>
                        <Row>
                            <Col><h5>{parseInt(recipeDetails.calories/recipeDetails.yield)}</h5></Col>
                            <Col><h5>{parseInt(recipeDetails.totalDaily.ENERC_KCAL.quantity/recipeDetails.yield)}%</h5></Col>
                            <Col><h5>{recipeDetails.yield}</h5></Col>
                        </Row>
                        <Row style={{"fontSize":"13px"}}>
                            <Col>CALORIES/ SERVING</Col>
                            <Col>DAILY VALUE</Col>
                            <Col>SERVINGS</Col>
                        </Row>
                        <hr></hr>
                        <span style={{"fontWeight":500}}>
                        {recipeDetails.healthLabels.map((label,id)=>(
                            <>
                            {id===recipeDetails.healthLabels.length?label:label+', '}
                            </>
                        ))}
                        </span>
                    </Col>
                </Row>

            </Card>:null}
        </Container>

    );
  }
  
  export default RecipeDetails;
  