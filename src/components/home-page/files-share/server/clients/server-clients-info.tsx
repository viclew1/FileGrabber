import { Table } from '@radix-ui/themes';
import { useSocketServer } from '../../../../../contexts/socket-server-context';

export default function ServerClientsInfo() {
    const { clients } = useSocketServer();
    return (
        <Table.Root size={'1'}>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Client address</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Connected at</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {clients.map((client, index) => {
                    const formattedDate = new Date(client.connectedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });
                    return (
                        <Table.Row key={`client-${client.peerUrl}-${index}`}>
                            <Table.RowHeaderCell style={{ userSelect: 'text' }}>{client.peerUrl}</Table.RowHeaderCell>
                            <Table.Cell style={{ userSelect: 'text' }}>{formattedDate}</Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
}
