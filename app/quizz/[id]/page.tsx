'use client'
import {Box, Button, Typography} from "@mui/material";
import React, {useEffect, useReducer, useState} from "react";
import {styled} from "@mui/system";
import Answer from "@/components/answer";
import ResponsiveDialog from "@/components/results";
interface myAnswer {
    [key: string]: any
}

const quizz = {
    title: 'Quizz 1',
    description : 'test thoi',
    questions : [
        {
            id : 'abcdbdc',
            question_text: 'What is the largest city in Australia?',
            is_single_choice: true,
            answers : [
                {
                    answer_text: 'test answer1',
                    id: 'abcdacbd121',
                } ,
                {
                    answer_text: 'test answer2',
                    id: 'abcdacbd211',
                },
                {
                    answer_text: 'test answer3',
                    id: 'abcdacbd311',
                },
                {
                    answer_text: 'test answer4',
                    id: 'abcdacbd411',
                }
            ]
        },
        {
            id : 'abcdbdc2',
            question_text: 'What is the largest city in Australia abcdba ?',
            is_single_choice: false,
            answers : [
                {
                    answer_text: 'test answer1',
                    id: 'abcdacbd122',
                } ,
                {
                    answer_text: 'test answer2',
                    id: 'abcdacbd222',
                },
                {
                    answer_text: 'test answer3',
                    id: 'abcdacbd322',
                },
                {
                    answer_text: 'test answer4',
                    id: 'abcdacbd422',
                }
            ]
        },
        {
            id : 'abcdbdc3',
            question_text: 'What is the largest city in Australia ashashs?',
            is_single_choice: true,
            answers : [
                {
                    answer_text: 'test answer1',
                    id: 'abcdacbd133',
                } ,
                {
                    answer_text: 'test answer2',
                    id: 'abcdacbd233',
                },
                {
                    answer_text: 'test answer3',
                    id: 'abcdacbd333',
                },
                {
                    answer_text: 'test answer4',
                    id: 'abcdacbd433',
                }
            ]
        },
        {
            id : 'abcdbdc44',
            question_text: 'What is the largest city in Australiasasajsjas?',
            is_single_choice: false,
            answers : [
                {
                    answer_text: 'test answer1',
                    id: 'abcdacbd144',
                } ,
                {
                    answer_text: 'test answer2',
                    id: 'abcdacbd244',
                },
                {
                    answer_text: 'test answer3',
                    id: 'abcdacbd344',
                },
                {
                    answer_text: 'test answer4',
                    id: 'abcdacbd444',
                }
            ]
        }
    ]
}
const BoxContainer = styled(Box)(({ theme }) => ({
    backgroundImage: `url(../background.jpg)`,
    backgroundSize: 'cover',
    height: '100vh',
    width: '200vh',
    paddingTop: '30px',

}))
const ButtonCheck = styled(Button)(({ theme }) => ({
    marginLeft: 10,
    width: 100
}))
export default function Quizz() {
    const [orderQuestion, setOrderQuestion] = useState(0)
    const [questions, setQuestions] = useState(quizz.questions[orderQuestion])
    const [answer, setAnswer] = useState<myAnswer>({})
    const [openResult, setOpenResult] = useState(false)
    const setNextQuestion = () =>{
        setOrderQuestion(orderQuestion + 1)
    }
    const setPrevQuestion = () =>{
        setOrderQuestion(orderQuestion - 1)
    }
    const setOrClearAnswer = (id: string) =>{
        let key = quizz.questions[orderQuestion].id
        if (answer[key] && answer[key].includes(id)) {
            // case clear when already chose
            setAnswer((ans) => {
                ans[key].splice(ans[key].indexOf(id), 1)
                return ans
            })
        } else if (!answer[key] || !answer[key].length ) {
            setAnswer((ans: myAnswer) => {
                ans[key] = [id]
                return ans
            })
        } else {
            // case already have chose answer
            setAnswer((ans: myAnswer) => {
                // if (quizz.questions[orderQuestion].is_single_choice) {
                //     // if single choice just pick one
                //     ans[key] = [id]
                // } else {
                //     ans[key].push(id)
                // }
                ans[key].push(id)
                return ans
            })
        }
    }
    const checkResult = () =>{
        setOpenResult((open) => !open)
    }
    useEffect(() => {
        setQuestions(quizz.questions[orderQuestion]);
    }, [orderQuestion]);
    return (
        <BoxContainer>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Typography mt={3} variant='h1'>Quizz</Typography>
            </Box>
            <Box sx={{
                position: 'relative',
                maxWidth: '100vh',
                minHeight: '50vh',
                backgroundColor: '#ebfeff',
                marginTop: '50px',
                marginLeft: '50vh',
                color: '#222222',
                padding: '20px',
                boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.25)',
                textAlign: 'center'
            }}>
                <Typography variant='h5'>Question {orderQuestion + 1}/{quizz.questions.length}</Typography>
                <Typography variant='h5'>{questions.question_text}</Typography>
                {/*{!quizz.questions[orderQuestion].is_single_choice && <i>You have to choose more than one</i>}*/}
                <Box sx={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {
                        questions.answers.map((item, index) => {
                            return (
                                <Answer
                                    isClicked = { (answer[quizz.questions[orderQuestion].id] || []).includes(item.id)}
                                    setAnswer = {setOrClearAnswer}
                                    item = {item}
                                    key = {item.id}
                                    answer = {answer}
                                />
                            )
                        })
                    }
                </Box>
                <Box sx={{
                    position: 'absolute',
                    bottom: '10px',
                    display: 'flex',

                }}>
                    <ButtonCheck
                        variant="contained"
                        onClick={() => {setPrevQuestion()}}
                        disabled = {!orderQuestion}
                    >
                        Previous
                    </ButtonCheck>
                    <ButtonCheck
                        variant="contained"
                        onClick={() => {setNextQuestion()}}
                        disabled = {orderQuestion === quizz.questions.length - 1}
                    >
                        Next
                    </ButtonCheck>
                    {
                        (orderQuestion === quizz.questions.length - 1) &&
                        <ButtonCheck
                            variant="contained"
                            onClick={()=>{checkResult()}}
                        > Submit</ButtonCheck>
                    }
                </Box>
            </Box>
            <ResponsiveDialog open={openResult} setOpen={setOpenResult} score={'8/10'}/>
        </BoxContainer>
    )
}
