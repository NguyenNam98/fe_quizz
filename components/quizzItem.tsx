'use client'
import React from "react";
import {Button, Typography} from "@mui/material"
import Box from "@mui/material/Box";
import { useRouter } from 'next/navigation'

interface quizzType {
    item : {
        id: string,
        title: string,
        description: string,
    }
    type : string
    score ?: string
    result_id ?: string
}
export default function QuizzItem(props: quizzType) {
    const {item, type, score, result_id} = props
    const router = useRouter()
    const startQuizz = () =>{
        router.push(`/quizz/${item.id}`)
    }
    const reviewResult = () =>{
        router.push(`/result/${result_id}`)
    }
    return (
        <Box sx={{
            backgroundColor: '#ffffff',
            height: 80,
            borderRadius: '10px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Box sx={{
                marginLeft: '15px',
                padding: '10px'

            }}>
                <Typography variant={'h6'}>
                    { item.title}
                </Typography>
                {
                    type !== 'new' &&
                    <Typography
                        sx ={{
                            fontSize: 12,
                            fontWeight: 400,
                            color: 'red'

                         }}
                    >
                        Result: {score}
                    </Typography>
                }
                <Typography sx={{
                    fontSize: 13,
                    fontWeight: 400,
                }}>{item.description}</Typography>
            </Box>
            <Box sx={{
                display: 'flex'
            }}>

                <Button
                    variant={"contained"}
                    color={'secondary'}
                    sx={{
                    height: 40,
                    width: 100,
                    color: '#ffffff',
                    marginRight: '15px',
                    }}
                    onClick={()=>{startQuizz()}}
                >
                    {type === 'new' ? 'Start' : 'Retake'}
                </Button>
                {
                    type !== 'new' &&  <Button
                        variant={"contained"}
                        color={'secondary'}
                        sx={{
                            height: 40,
                            width: 100,
                            color: '#ffffff',
                            marginRight: '15px',
                        }}
                        onClick={()=>{reviewResult()}}
                    >
                        Review
                    </Button>
                }
            </Box>
        </Box>
    )
}
