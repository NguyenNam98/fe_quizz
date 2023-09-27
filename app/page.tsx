'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import {Tab, Tabs, Typography} from "@mui/material";
import dynamic from 'next/dynamic'

import TabPanel from "@/components/tabPanel";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useRouter} from "next/navigation";
import axios from "axios";
const QuizzItem = dynamic(() => import('@/components/quizzItem'), { ssr: false })

interface quizzType{
    id: string
    title: string
    description: string
}
export default function HomePage() {
    const [value, setValue] = useState(1)
    const [cookies, setCookie] = useCookies(['tk'])
    const [completedQuizz, setCompletedQuizz] = useState<quizzType[]>([])
    const [unCompletedQuizz, setUncompletedQuizz] = useState<quizzType[]>([])
    const router = useRouter()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    };
    useEffect(() =>{
        if (!cookies.tk) {
            router.push('/login')
        } else {
              let options = {
                  headers: {
                      'Authorization':`Token ${cookies.tk}`
                  }
              }
              const getData = async () => {
                try {
                    const res = await axios.get('http://localhost:8000/api/quizz',options)
                    if (res.data?.data) {
                        setCompletedQuizz(res.data.data.completed)
                        setUncompletedQuizz(res.data.data.new)
                    } else {
                        router.push('/login')
                    }
                } catch (e) {
                    router.push('/login')
                }
            }
            getData()
        }

    }, [])
    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            width: '200vh',
            paddingTop: '30px',
            backgroundColor: '#f0f0f0',
            // justifyContent: 'center',
            flexDirection: 'column',
            color: '#333333'

        }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Typography variant={'h2'}>Wellcome to quizz</Typography>
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: '20vh',
                    left: '50vh',
                    marginTop: '20px',
                    width: '100vh',
                    maxHeight: '50vh',
                    // backgroundColor: '#ffffff'

                }}
            >
                <Box sx={{
                    width: '100%',
                }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                        sx={{
                            marginLeft: '30%'
                        }}
                    >
                        <Tab value={1} label="New Quizzes" />
                        <Tab value={2} label="Completed Quizzes" />
                    </Tabs>
                    <TabPanel
                        value={value}
                        index={1}
                    >
                        {
                            unCompletedQuizz.map((item) => {
                                return (
                                    <QuizzItem
                                        key = {item.id}
                                        item = {item}
                                        type = {'new'}
                                    />
                                )
                            })
                        }
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        {
                            completedQuizz.map((item) => {
                                return (
                                    <QuizzItem
                                        key = {item.id}
                                        item = {item}
                                        type ={'old'}
                                    />
                                )
                            })
                        }
                    </TabPanel>
                    </Box>
            </Box>
        </Box>
    );
}