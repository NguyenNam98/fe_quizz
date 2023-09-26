'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import {Tab, Tabs, Typography} from "@mui/material";
import dynamic from 'next/dynamic'

import TabPanel from "@/components/tabPanel";
import {useEffect, useState} from "react";
const QuizzItem = dynamic(() => import('@/components/quizzItem'), { ssr: false })

const listQuizzCompleted = [
    {
        id: 'abcd112',
        title: 'quizz11',
        description: 'test quizz test quizz test quizz test quizz test quizz '
    },
    {
        id: 'abcd222',
        title: 'quizz11',
        description: 'test quizz test quizz test quizz test quizz test quizz '
    },
    {
        id: 'abcd333',
        title: 'quizz11',
        description: 'test quizz test quizz test quizz test quizz test quizz '
    },
    {
        id: 'abcd444',
        title: 'quizz11',
        description: 'test quizz test quizz test quizz test quizz test quizz '
    },
]
const listQuizzNew = [
    {
        id: 'abcd1',
        title: 'quizz12',
        description: 'test quizz test quizz test quizz test quizz test quizz '
    },
    {
        id: 'abcd2',
        title: 'quizz12',
        description: 'test quizz test quizz test quizz test quizz test quizz '
    },
    {
        id: 'abcd3',
        title: 'quizz12',
        description: 'test quizz test quizz test quizz test quizz test quizz '
    },
    {
        id: 'abcd4',
        title: 'quizz12',
        description: 'test quizz test quizz test quizz test quizz test quizz '
    },
]


export default function HomePage() {
    const [value, setValue] = useState(1)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    };
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
                <Typography mt={3} variant='h2'>Wellcome to quizz</Typography>
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
                            listQuizzNew.map((item) => {
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
                            listQuizzCompleted.map((item) => {
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