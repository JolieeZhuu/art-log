package com.project.art_log.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public abstract class AbstractService<T, ID> {
	private final JpaRepository<T, ID> repository;

    public AbstractService(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }
    
    public List<T> getAll() {
    	return repository.findAll();
    }
    
    public T getById(ID id) {
    	Optional<T> optionalEntity = repository.findById(id);
        if(optionalEntity.isPresent()){
            return optionalEntity.get();
        }
        return null;
    }
    
    public T save(T entity) {
    	T savedEntity = repository.save(entity);

        return savedEntity;
    }
    
    public T update(T entity) {
    	T updatedEntity = repository.save(entity);

        return updatedEntity;
    }

    public void deleteById(ID id) {
    	repository.deleteById(id);
    }
}
