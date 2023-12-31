'use client'
import {Box, Button, Typography} from "@mui/material"
import React, {useEffect, useState} from "react"
import {styled} from "@mui/system"
import Answer from "@/components/answer"
import ResponsiveDialog from "@/components/results"
import axios from "axios"
import {useRouter} from "next/navigation"
import {useCookies} from "react-cookie"
import CloseIcon from '@mui/icons-material/Close'
interface myAnswer {
    [key: string]: any
}
interface dataCheckType {
    score: string
}
interface answerType {
    id: string
    answer_text: string
}
interface answerPostType {
    question_id: string
    selected_answer: string
}
interface questionType {
    id: string
    question_text: string
    answers: answerType[]
}
interface quizzType {
    id: string,
    attributes: {
        questions: questionType[]
    }
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
export default function Quizz({ params }: { params: { id: string } }) {
    const [orderQuestion, setOrderQuestion] = useState(0)
    const [quizz, setQuizz] = useState<quizzType>({} as quizzType)
    const [questions, setQuestions] = useState<questionType>({} as questionType)
    const [answer, setAnswer] = useState<myAnswer>({})
    const [openResult, setOpenResult] = useState(false)
    const router = useRouter()
    const [result, setResult] = useState('0')
    const [cookies, setCookie] = useCookies(['tk'])

    const setNextQuestion = () =>{
        setOrderQuestion(orderQuestion + 1)
    }
    const backHome = () =>{
        router.push('/')
    }
    const setPrevQuestion = () =>{
        setOrderQuestion(orderQuestion - 1)
    }
    const setOrClearAnswer = (id: string) =>{
        let key = quizz.attributes.questions[orderQuestion].id
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
                ans[key].push(id)
                return ans
            })
        }
    }
    const checkResult = async () =>{
        const options = {
            headers: {
                'Authorization':`Token ${cookies.tk}`
            }
        }
        const answerQuestion = Object.keys(answer).reduce((prev: answerPostType[], current: string) => {
            if (answer[current].length > 0) {
                prev.push({
                    question_id: current,
                    selected_answer: answer[current]
                })
            }
            return prev
        }, [])
        if (answerQuestion.length < quizz.attributes.questions.length) {
            alert('Please make sure you finish all question !')
            return
        }
        const data = {
            quizz_id: params.id,
            answer: answerQuestion
        }
        let dataCheck = {} as dataCheckType
        const urlCheckAnswer = `${process.env.NEXT_PUBLIC_HOST_API}/api/check-answer`
        try {
            const response = await axios.post(urlCheckAnswer, data, options)
            dataCheck = response.data.data
        } catch (e) {
            router.push('/')
        }

        setResult(dataCheck.score)
        setOpenResult((open) => !open)
    }
    useEffect(()=>{
        setQuestions(quizz?.attributes?.questions[orderQuestion]|| [])
    }, [orderQuestion])

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
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_HOST_API}/api/quizz/${params.id}`,options)
                    if (res.data?.data) {
                        setQuizz(res.data?.data)
                        setQuestions(res.data?.data.attributes.questions[0])
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
                <CloseIcon
                    sx={{
                        position: 'absolute',
                        right: 10,
                        top: 10,
                        color: '#111111',
                        cursor:'pointer'
                    }}
                    onClick={() => {backHome()}}
                />
                <Typography variant='h5'>Question {orderQuestion + 1}/{quizz?.attributes?.questions.length}</Typography>
                <Typography variant='h5'>{questions.question_text}</Typography>
                {/*{!quizz.questions[orderQuestion].is_single_choice && <i>You have to choose more than one</i>}*/}
                <Box sx={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {
                        questions?.answers?.map((item, index) => {
                            return (
                                <Answer
                                    isClicked = { (answer[quizz?.attributes?.questions[orderQuestion].id] || []).includes(item.id)}
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
                        disabled = {orderQuestion === quizz?.attributes?.questions.length - 1}
                    >
                        Next
                    </ButtonCheck>
                    {
                        (orderQuestion === quizz?.attributes?.questions.length - 1) &&
                        <ButtonCheck
                            variant="contained"
                            onClick={()=>{ checkResult() }}
                        > Submit</ButtonCheck>
                    }
                </Box>
            </Box>
            <ResponsiveDialog open={openResult} setOpen={setOpenResult} score={result}/>
        </BoxContainer>
    )
}
