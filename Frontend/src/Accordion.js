import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SimpleAccordion({title, children}) {
  return (
    <div>
      <StyledAccordion>
        <AccordionSummary
        //   expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {children}
        </AccordionDetails>
      </StyledAccordion>
    </div>
  );
}

const StyledAccordion = styled(Accordion)`
    background-color: #F5F5F5;
    border: 1px solid #E0E0E0;
    max-width: 500px;
    margin: 0 0 10px 0;
    padding: 0;
    &.Mui-expanded {
        margin: 0;
    }
    .MuiAccordionSummary-root {
        min-height: 56px;
        padding: 0 16px;
        background-color: #F5F5F5;
        &.Mui-expanded {
            min-height: 56px;
        }
        .MuiAccordionSummary-content {
            margin: 12px 0;
            &.Mui-expanded {
                margin: 12px 0;
            }
        }
    }
    .MuiAccordionDetails-root {
        padding: 10px 16px 16px 16px;
        background-color: #F5F5F5;
        box-shadow: none;
        border-top: 1px solid #E0E0E0;
    }
`
