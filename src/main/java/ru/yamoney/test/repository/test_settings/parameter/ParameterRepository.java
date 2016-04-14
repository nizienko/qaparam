package ru.yamoney.test.repository.test_settings.parameter;

import ru.yamoney.test.entity.DomainObject;
import ru.yamoney.test.repository.CommonRepository;

import java.util.List;

/**
 * Created by nizienko on 13.04.2016.
 */
public interface ParameterRepository<V extends DomainObject> extends CommonRepository<V> {
    List<V> fetchByGroupId(long groupId);
    List<V> fetchByGroupName(String name);
}
