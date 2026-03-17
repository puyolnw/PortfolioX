interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface MockDataTableProps {
  title: string;
  columns: Column[];
  data: Record<string, any>[];
  color?: string;
}

export default function MockDataTable({ title, columns, data, color = '#3b82f6' }: MockDataTableProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>{title}</h3>
        <span style={{
          padding: '4px 12px',
          borderRadius: 8,
          background: `${color}10`,
          color: color,
          fontSize: '0.75rem',
          fontWeight: 700
        }}>{data.length} records</span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  background: '#f8fafc',
                  color: '#64748b',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  borderBottom: '1px solid #f1f5f9',
                  whiteSpace: 'nowrap'
                }}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                {columns.map(col => (
                  <td key={col.key} style={{
                    padding: '12px 16px',
                    color: '#334155',
                    whiteSpace: 'nowrap'
                  }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
