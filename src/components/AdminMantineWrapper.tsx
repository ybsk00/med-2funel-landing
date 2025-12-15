"use client";

import { MantineProvider, createTheme, MantineColorsTuple } from "@mantine/core";

// Admin 전용 오렌지 테마
const orange: MantineColorsTuple = [
    "#fff4e6",
    "#ffe8cc",
    "#ffd8a8",
    "#ffc078",
    "#ffa94d",
    "#ff922b",
    "#fd7e14",
    "#e8590c",
    "#d9480f",
    "#c92a2a",
];

const adminTheme = createTheme({
    primaryColor: "orange",
    colors: {
        orange: orange,
    },
    components: {
        // TextInput, Textarea, Select 다크 스타일
        TextInput: {
            styles: {
                input: {
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    borderColor: 'var(--mantine-color-dark-4)',
                    color: 'white',
                    '&::placeholder': {
                        color: 'var(--mantine-color-gray-5)',
                    },
                },
                label: {
                    color: 'var(--mantine-color-gray-4)',
                },
            },
        },
        Textarea: {
            styles: {
                input: {
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    borderColor: 'var(--mantine-color-dark-4)',
                    color: 'white',
                    '&::placeholder': {
                        color: 'var(--mantine-color-gray-5)',
                    },
                },
                label: {
                    color: 'var(--mantine-color-gray-4)',
                },
            },
        },
        PasswordInput: {
            styles: {
                input: {
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    borderColor: 'var(--mantine-color-dark-4)',
                    color: 'white',
                },
                label: {
                    color: 'var(--mantine-color-gray-4)',
                },
            },
        },
        Select: {
            styles: {
                input: {
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    borderColor: 'var(--mantine-color-dark-4)',
                    color: 'white',
                },
                label: {
                    color: 'var(--mantine-color-gray-4)',
                },
                dropdown: {
                    backgroundColor: 'var(--mantine-color-dark-7)',
                    borderColor: 'var(--mantine-color-dark-4)',
                },
                option: {
                    color: 'white',
                    '&[data-selected]': {
                        backgroundColor: 'var(--mantine-color-orange-6)',
                    },
                    '&:hover': {
                        backgroundColor: 'var(--mantine-color-dark-5)',
                    },
                },
            },
        },
        Modal: {
            styles: {
                header: {
                    backgroundColor: 'var(--mantine-color-dark-7)',
                },
                content: {
                    backgroundColor: 'var(--mantine-color-dark-7)',
                },
                title: {
                    color: 'white',
                },
            },
        },
        Table: {
            styles: {
                table: {
                    backgroundColor: 'var(--mantine-color-dark-7)',
                },
                thead: {
                    backgroundColor: 'var(--mantine-color-dark-8)',
                },
                th: {
                    color: 'var(--mantine-color-gray-5)',
                    borderColor: 'var(--mantine-color-dark-5)',
                },
                td: {
                    color: 'white',
                    borderColor: 'var(--mantine-color-dark-5)',
                },
                tr: {
                    '&:hover': {
                        backgroundColor: 'var(--mantine-color-dark-6)',
                    },
                },
            },
        },
        Paper: {
            styles: {
                root: {
                    backgroundColor: 'var(--mantine-color-dark-7)',
                    borderColor: 'var(--mantine-color-dark-5)',
                },
            },
        },
    },
});

export default function AdminMantineWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MantineProvider theme={adminTheme} forceColorScheme="dark">
            {children}
        </MantineProvider>
    );
}
