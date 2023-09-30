'use client'
import {Box, Button, Paper, Typography} from "@mui/material"
import React, {useEffect, useState} from "react"
import {styled} from "@mui/system"
import Answer from "@/components/answer"
import ResponsiveDialog from "@/components/results"
import axios from "axios"
import {useRouter} from "next/navigation"
import {useCookies} from "react-cookie"
import CloseIcon from '@mui/icons-material/Close'
import Information from "@/components/review/information";
import Question from "@/components/review/question";

interface quizzType {
    id : string
    title: string
    description: string
}
interface answerType {
    id : string
    answer_text: string
}
interface questionType {
    id : string
    question_text: string
    answers: answerType[]
}
interface userAnswerObjectType {
   [ket: string]:userAnswerType
}
interface userAnswerType {
    correct_answer : string[]
    user_response_answer: string[]
    question_id: string
}
interface quizzInfoType {
    userAnswer : userAnswerType[]
    score: string
    timeCompleted: string
    quizzInfo: quizzType
    question_info: questionType[]

}
export interface questionInfoType {
    questionText: string
    answers: answerType[]
    userSelected: string[]
    rightAnswer: string[]
}
export default function Result({ params }: { params: { id: string } }) {
    const [cookies, setCookie] = useCookies(['tk'])
    const router = useRouter()
    const [quizzResult, setQuizzResult] = useState<quizzInfoType>({} as quizzInfoType)
    const [questionInfo, setQuestionInfo] = useState<questionInfoType[]>([] as questionInfoType[])

    const backHome =() =>{
        router.push('/')
    }
    useEffect(() =>{
        if (!cookies.tk) {
            router.push('/login')
        } else {
            const options = {
                headers: {
                    'Authorization':`Token ${cookies.tk}`
                }
            }
            const getData = async () => {
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_HOST_API}/api/quizz-review/${params.id}`,options)
                    if (res.data?.data) {
                        setQuizzResult(res.data?.data)
                        const userAnswerInfo = res.data.data.userAnswer
                        const userAnswerInfoObject = userAnswerInfo.reduce((prev: userAnswerObjectType, item: userAnswerType) => {
                            prev[item.question_id] = item
                            return prev
                        }, {})
                        const result =res.data.data.questionInfo.map((item: questionType ) => {
                            return {
                                questionText: item.question_text,
                                answers: item.answers,
                                userSelected: userAnswerInfoObject[item.id].user_response_answer,
                                rightAnswer: userAnswerInfoObject[item.id].correct_answer
                            }
                        })
                        console.log('result', result)
                        setQuestionInfo(result)
                    } else {
                        router.push('/')
                    }
                } catch (e) {
                    router.push('/')
                }
            }
            getData()
        }

    }, [])
    return (
        <Paper sx={{
            width:'200vh',
            // height:'100vh',
            backgroundColor:'#f0f0f0',
            display: 'flex',
            alignItems:'center',
            flexDirection: 'column',
            paddingTop: '30px',
            justifyContent: 'center'
        }}>
            <Box sx={{
                position: 'relative',
                // height:'100%',
                borderRadius: '8px',
                margin: 'auto',
                width: '45%',
                // padding: '20px',
                backgroundColor: '#ffffff',
                paddingTop: '30px',
            }}>
                <Box>
                    <Typography typography={'h4'} sx={{
                        position: 'absolute',
                        left: '35%'
                    }}>Result quizz</Typography>
                </Box>
                <Box sx={{
                    marginTop: '50px',
                    backgroundColor: '#E5E5E5'
                }}>
                    <Information
                     completedAt={quizzResult.timeCompleted}
                     title={quizzResult.quizzInfo?.title}
                     description={quizzResult.quizzInfo?.description}
                     score={quizzResult.score}
                    />
                </Box>
                <Box>
                    {
                        questionInfo?.map((item, index) => {
                            return(
                                <Question
                                    index={index}
                                    questionInfo={item}
                                />
                            )
                        })
                    }
                </Box>
                <Box sx={{
                    padding: '20px',
                    marginBottom: '20px'
                }}>
                    <Button
                        variant={'contained'}
                        color={'secondary'}
                        onClick={()=> backHome()}

                    >
                        Return Home
                    </Button>
                </Box>
            </Box>
        </Paper>
    )
}
