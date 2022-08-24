import React, { useState, useEffect } from 'react';
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import { Bars } from  'react-loader-spinner'


function ReceipeList() {
  const [recipeList, setRecipeList] = useState([]);
  const [searchRecipe, setsearchRecipe] = useState('chicken');
  const [modalShow, setModalShow] = useState(false);

  const [calFrom, setStateCalFrom] = useState('');
  const [calTo, setStateCalTo] = useState('');
  const [ingredients, setStateIngredients] = useState('');
  const [dietOptions, setDietOptions] = useState([]);

  const [spinnerLoading, setSpinnerLoading] = useState(false);

    const onChangeCheckbox = (name,isChecked)=>{
      if(isChecked){
        setDietOptions([...dietOptions,name])
      }else{
        dietOptions.splice(dietOptions.indexOf(name),1)
      }
    }

    const applyFilters = ()=>{
      console.log('calFrom '+calFrom)
      console.log('calTo '+calTo)
      console.log("ingredients "+ingredients)
      console.log(dietOptions)
      fetchRecipe(searchRecipe,calFrom,calTo,ingredients,dietOptions)
      setModalShow(false);
    }

  useEffect(() => {
    fetchRecipe(searchRecipe,calFrom,calTo,ingredients,dietOptions);
  },[]);

    const fetchRecipe = async(value,calFrom,calTo,ingredients,dietOptions)=>{
        const appId = '7cbf5469';
        const appKey = 'ab9b4b8ea8cd2ce4fc30bf1a3ce7f657';
       
        value=(value==='')?'chicken':value;
        let filterHtml = `https://api.edamam.com/api/recipes/v2?type=public&q=${value}&app_id=${appId}&app_key=${appKey}`;
        if(calFrom!=='' && calTo !== ''){
          filterHtml += `&calories=${calFrom}-${calTo}`;
        }else if(calFrom!=='' && calTo ===''){
          filterHtml += `&calories=${calFrom}%2B`;
        }else if(calFrom==='' && calTo !==''){
          filterHtml += `&calories=${calTo}`;
        }

        if(ingredients !== ''){
          filterHtml += `&ingr=${ingredients}`;
        }

        if(dietOptions.length>0){
          dietOptions.forEach((dietOption)=>{
            filterHtml += `&diet=${dietOption}`;
          })
        }

        
        console.log(filterHtml)
        await axios.get(`${filterHtml}`)
        .then((response) => {
          console.log(response.data)
          console.log(response.data.hits)
          setRecipeList(response.data.hits);
          setSpinnerLoading(false)
        }).catch(error => {
            console.log('error to fetch recipe list')
            console.log(error)
            setSpinnerLoading(true)
            var fetchingApi = setTimeout(function() {
                fetchRecipe(searchRecipe,calFrom,calTo,ingredients,dietOptions)
            }, 30 * 1000);  
          
        });
    }

    const changeSearch = (value)=>{
        setsearchRecipe(value)
        fetchRecipe(value,calFrom,calTo,ingredients,dietOptions)
    }

    const openModal = () =>{
      setStateCalFrom('')
      setStateCalTo('')
      setStateIngredients('')
      setDietOptions([])
      setSpinnerLoading(false)
      setModalShow(true)
    }
    const openRecipeDetails = (recipeId) =>{
      window.open("thehousemonk/recipeDetails/"+recipeId, "_blank");
      console.log(recipeId)
    }
  return (
    <>
    <Container>
        <InputGroup className="my-3">
            <Form.Control placeholder='Recipe Name' style={{"borderRadius":"1em 0em 0em 1em"}} onKeyUp={(e)=>changeSearch(e.target.value)} />
            <InputGroup.Text style={{"background":"greenyellow"}}><i  className="fa fa-search"></i></InputGroup.Text>
        </InputGroup>
        <Button variant="outline-secondary mb-3" onClick={() => openModal()}>
            REFINED SEARCH BY<span style={{"fontWeight":600}}className="mx-2">Calories, Diet, Ingredients</span><i style={{"color":"greenyellow",'fontSize':'22px'}} className="fa-solid fa-caret-down"></i>
        </Button>
        <Row xs={1} md={3} className="g-4">
            {!spinnerLoading && recipeList.length>0?recipeList.map((recipeData,id)=>(
                <Col>
                    <Card className='card_recipe' onClick={()=> openRecipeDetails(recipeData.recipe.uri.split('#recipe_').pop())}>
                        <Card.Img variant="top" src={recipeData.recipe.image} />
                        <Card.Body className=''>
                        <Card.Title>{recipeData.recipe.label}</Card.Title>
                        <Card.Text>
                          <hr></hr>
                          <Row className='mt-2'>
                            <Col xs={6} className="my-1 pt-2">
                               <span style={{"color":"mediumseagreen"}}>{recipeData.recipe.ingredients.length}</span> INGREDIENTS
                            </Col>
                            <Col>
                              <p className="vl" style={{'marginTop':"12px"}}></p>
                            </Col>
                            <Col xs={5} className="my-1 pt-2">
                               <span style={{"color":"mediumseagreen"}}>{parseInt(recipeData.recipe.calories/recipeData.recipe.yield)}</span> CALORIES
                            </Col>
                          </Row>
                            <hr></hr>
                            <Row className='m-1 mt-2' style={{'fontWeight':"600","color":"darkgrey"}}>{recipeData.recipe.source}</Row>
                          
                        </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            )):
            <div className="mt-4 pt-4 mx-auto">
              <Row className="text-center">
                {recipeList.length === 0?<><h5>Please Wait...</h5><h6>No recipe found! Please try resetting filters.</h6></>:<h6>Please Wait...</h6>}
              </Row>
              <Row>
                <Bars
                  className="mx-auto"
                  height={100}
                  width={100}
                  color="green"
                  ariaLabel="bars-loading"
                  wrapperStyle={{ "zIndex": modalShow?"-1":"99999",'display':'block'}}
                  wrapperClass=""
                  type="Puff"
                  visible={spinnerLoading}
                />
              </Row>
            
            </div>
      }
        </Row>
    </Container>
    <Modal show={modalShow} onHide={() => setModalShow(false)} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Body className="show-grid">
          <Container>
                
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">

                    <Col sm='12' md={6}>
                      <Form.Label column sm="12" md={6}>
                      Calories
                      </Form.Label>
                      <Col sm="12"  md={12}>
                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label column sm="6"  md={4}>
                            From  
                            </Form.Label>
                            <Col sm="6"  md={8} className="mb-3">
                              <Form.Control type="number" min={0} onChange={(e)=>setStateCalFrom(e.target.value)} />
                            </Col>
                            <Form.Label column sm="6"  md={4}>
                            To  
                            </Form.Label>
                            <Col sm="6"  md={8}>
                              <Form.Control type="number" min={0} onChange={(e)=>setStateCalTo(e.target.value)} />
                            </Col>
                        </Form.Group>
                      </Col>
                    </Col>
                    
                    <Col sm='12' md={6} >
                        <Form.Label column >
                        Diet
                        </Form.Label>
                        <Col onChange={(e)=>onChangeCheckbox(e.target.name,e.target.checked)}>
                          <Form.Check
                              label="Low-Carb"
                              name="low-carb"
                              type='checkbox'
                          />
                          <Form.Check
                              label="High-Fiber"
                              name="high-fiber"
                              type='checkbox'
                              />
                            <Form.Check
                                label="High-Protein"
                                name="high-protein"
                                type='checkbox'
                            />
                          <Form.Check
                              label="Low-Sodium"
                              name="low-sodium"
                              type='checkbox'
                          />
                          </Col>
                    </Col>
                    
                </Form.Group>

                <Form.Label column sm="12" md={6}>
                  Ingredients
                </Form.Label>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="2"  md={2}>
                    Up to 
                    </Form.Label>
                    <Col sm="10"  md={4}>
                    <Form.Control type="number" min={0} onChange={(e)=>setStateIngredients(e.target.value)} />
                    </Col>
                </Form.Group>

                
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button onClick={props.onHide}>Done</Button> */}
          <Button variant='success' onClick={()=>applyFilters()}><i className="fa-solid fa-circle-check mx-1"></i>Done</Button>
        </Modal.Footer>
      </Modal>
      
    </>
  );
}

export default ReceipeList;
