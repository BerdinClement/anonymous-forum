import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Message} from "./entities/message.entity";

const mockMessageRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
});

type MockRepo = Partial<Record<keyof Repository<Message>, jest.Mock>>;

describe('MessagesService', () => {
  let service: MessagesService;
  let repository: MockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useFactory: mockMessageRepository,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    repository = module.get(getRepositoryToken(Message));
  });

  it('should create a message', async () => {
    const dto = { author: 'Alice', content: 'Hello' };
    const saved = { id: 1, ...dto, createdAt: new Date() };

    repository.create!.mockReturnValue(dto);
    repository.save!.mockResolvedValue(saved);

    const result = await service.create(dto);
    expect(result).toEqual(saved);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(dto);
  });

  it('should return all messages', async () => {
    const messages = [{ id: 1, author: 'Bob', content: 'Hey', createdAt: new Date() }];
    repository.find!.mockResolvedValue(messages);

    const result = await service.findAll();
    expect(result).toEqual(messages);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should delete a message by id', async () => {
    repository.delete!.mockResolvedValue({ affected: 1 });

    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw if delete fails', async () => {
    repository.delete!.mockResolvedValue({ affected: 0 });

    await expect(service.remove(42)).rejects.toThrow('Message with ID 42 not found');
  });
});
