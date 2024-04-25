import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { Button, Grid, Paper, Typography } from '@mui/material';
import React, { ReactComponentElement, ReactElement, ReactNode, useState } from 'react';

interface IProps {
  label: string;
  form: any;
  card?: any;
}
export default function AdditionalDetails(props: IProps) {
  const [showForm, setShowForm] = useState(false);
  const [values, setValues] = useState<any[]>([]);
  const Form = props.form;
  const Card = props.card;
  const handleSubmit = (value: any) => {
    let newValue;
    if (props.label == 'Basic Utilities Data') {
      newValue = {
        waterResources: Object.values(value.waterResources).map((v, index) => ({
          field: Object.keys(value.waterResources)[index],
          value: v,
        })),
        powerResources: Object.values(value.powerResources).map((v, index) => ({
          field: Object.keys(value.powerResources)[index],
          value: v,
        })),
      };
    } else {
      newValue = Object.values(value).map((v, index) => ({
        field: Object.keys(value)[index],
        value: v,
      }));
    }
    setValues([...values, newValue]);
    setShowForm(false);
  };
  return (
    <Grid container direction='column' flexWrap='nowrap' gap='32px'>
      <Grid
        component={Paper}
        container
        flexWrap='nowrap'
        justifyContent='space-between'
        p='25px'
        bgcolor='white'
        alignItems='center'
      >
        <Typography>Add {props.label}</Typography>
        <Button variant='contained' onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add'}
        </Button>
      </Grid>
      {showForm && (
        <Grid>
          <Form onSubmit={handleSubmit} />
        </Grid>
      )}
      {Card && values?.map((value: any, index: number) => <Card values={value} key={index} />)}
    </Grid>
  );
}
