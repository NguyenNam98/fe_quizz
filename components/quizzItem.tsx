'use client'
import React from "react";
import {Button, Paper, Typography} from "@mui/material"
import Box from "@mui/material/Box";
import { useRouter } from 'next/navigation'

interface quizzType {
    item : {
        id: string,
        title: string,
        description: string,
    }
    type : string
}
export default function QuizzItem(props: quizzType) {
    const {item, type} = props
    const router = useRouter()
    const startQuizz = () =>{
        router.push(`/quizz/${item.id}`)
    }
    return (
        <Paper sx={{
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
                <Typography variant={'h6'}>{item.title}</Typography>
                <Typography sx={{
                    fontSize: 13,
                    fontWeight: 400,
                }}>{item.description}</Typography>
            </Box>
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
        </Paper>
    )
}
