import React, { useState } from 'react'
import styled from 'styled-components'
export const TableContainer = ({ data }) => {
  const headers = data?.fields.map(f => f.name)
  const rows = data?.rows
  console.log(data)
  return (
    <TableWrapper cellSpacing={0}>
      <TableHead>
        <TableRow style={{ height: 32 }}>
          <TextHeadCell>#</TextHeadCell>
          {headers && headers.map(h => <TextHeadCell>{h}</TextHeadCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows &&
          rows.map((r, i) => (
            <TableRow>
              {<TableCell>{i}</TableCell>}
              {headers &&
                headers.map(h => (
                  <TableCell
                    contentEditable
                    onClick={() => {
                      console.log(r)
                    }}
                    onInput={e => console.log(e.target.innerHTML)}
                  >
                    {r[h] === true
                      ? 'True'
                      : r[h] === false
                      ? 'False'
                      : r[h] === null
                      ? 'Null'
                      : r[h]}
                  </TableCell>
                ))}
            </TableRow>
          ))}
      </TableBody>
    </TableWrapper>
  )
}

export const TableWrapper = styled.table``
export const TableHead = styled.thead``
export const TextHeadCell = styled.th`
  text-align: left;
  min-width: 80px;
  background-color: #404040;
`
export const TableCell = styled.td`
  heigth: 48px;
  font-size: 16px;
  padding-left: 5px;
  padding-right: 5px;
  max-width: 300px;
  min-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #252525;
  }
`

export const TableRow = styled.tr`
  height: 40px;
`
export const TableBody = styled.tbody`
  ${TableRow}:nth-child(even) {
    background-color: #404040;
  }
`

export const CellInput = styled.input`
  height: 40px;
  border: none;
  width: 290px;
  background-color: #252525;
  color: #fff;
  margin: 0;
  font-size: 16px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
  outline: none;
`

const TableCellContent = ({ content }) => {
  const [editable, setEditable] = useState(false)
  const [cellContent, setCellContent] = useState(content)
  const onSubmit = e => {
    e.preventDefault()
    console.log(cellContent)
    // setEditable(false)
  }
  if (editable) {
    return (
      <form onSubmit={onSubmit}>
        <CellInput
          type="text"
          value={cellContent}
          onChange={e => setCellContent(e.target.value)}
        />
      </form>
    )
  } else {
    return (
      <span contenteditable style={{ width: '100%', height: '100%' }}>
        {content}
      </span>
    )
  }
}
